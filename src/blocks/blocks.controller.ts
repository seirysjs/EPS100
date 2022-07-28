import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  Res,
  UseGuards,
  ValidationError,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlueprintsService } from 'src/blueprints/blueprints.service';
import { OrderItemsService } from 'src/order-items/order-items.service';
import { ProductClass } from 'src/product-classes/product-class.entity';
import { ProductClassService } from 'src/product-classes/product-class.service';
import { WarehouseItem } from 'src/warehouse-items/warehouse-item.entity';
import { WarehouseItemsService } from 'src/warehouse-items/warehouse-items.service';
import { WorkersService } from 'src/workers/workers.service';
import { BlockCut } from './block-cut.entity';
import { Block } from './block.entity';
import { BlockMultiCut } from './block-multi-cut.entity';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(
    private readonly blocksService: BlocksService,
    private readonly productClassService: ProductClassService,
    private readonly workersService: WorkersService,
    private readonly blueprintsService: BlueprintsService,
    private readonly warehouseItemsService: WarehouseItemsService,
    private readonly orderItemsService: OrderItemsService,
  ) { }

  
  @UseGuards(JwtAuthGuard)
  @Get('new')
  async getIdForNewBlock(): Promise<number> {
    return (await this.blocksService.getLastBlockId()) + 1;
  }

  @UseGuards(JwtAuthGuard)
  @Post('new')
  async create(@Body() block: any): Promise<object> {
    const validateBlock = new Block();
    validateBlock.block_id = block.block_id;
    validateBlock.worker_id = block.worker_id;
    validateBlock.product_class_id = block.product_class_id;
    validateBlock.drying_started_at = block.drying_started_at;
    validateBlock.drying_ends_at = block.drying_ends_at;
    validateBlock.status = (block.status != 0) ? block.status : undefined;
    
    const validation = await this.blocksService.validation(validateBlock);
    const content = {
      errors: [],
    };
    if (validation.length != 0) {
      content.errors = validation;
      return content;
    }
    if (await this.blocksService.findOne(block.block_id)) {
      content.errors = [
        {
          property: 'block_id',
          constraints: {
            duplicate: `block_id DUPLICATE! Block ${block.block_id} already exists`,
          },
        },
      ];
      return content;
    }
    for (let blockIndex = 0; blockIndex < block.count; blockIndex++) {
      await this.blocksService.create(validateBlock);
      validateBlock.block_id = validateBlock.block_id + 1;
    }
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/edit')
  async update(@Body() block: Block, @Param('id') id: number): Promise<object> {
    block.block_id = id;
    const validation = await this.blocksService.validation(block);
    const content = {
      errors: []
    };
    if (validation.length != 0) {
      content.errors = validation;
      return content;
    }
    block.block_id = id;
    await this.blocksService.updateBlock(block);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Block[] | { blocks: Block[] }> {
    const blocks = await this.blocksService.findAll();
    return blocks;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Block> {
    return await this.blocksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('multi-cut')
  async blockMultiCut(@Body() formData: any, @Param('id') id: number): Promise<object> {
    const content = {
      errors: [],
    };
    
    const productClassId = formData.product_class_id;
    const workerId = formData.worker_id;
    const created_at = new Date();
    const blocks = formData.blocks;
    const cuts = formData.cuts;    

    if (!productClassId || !workerId) return;

    for (let indexBlock = 0; indexBlock < blocks.length; indexBlock++) {
      const block = blocks[indexBlock];
      if ((await this.blocksService.findOne(block.block_id)).status != "done") continue;
      content.errors.push({ property: "block_" + block.block_id, constraints: [{["block_" + block.block_id]: `block_${block.block_id} already done`}] });
    }

    if (content.errors.length != 0) return content;

    const blockMultiCut = new BlockMultiCut();
    blockMultiCut.block_multi_cut_id = (await this.blocksService.getLastBlockMultiCutId()) + 1;
    blockMultiCut.product_class_id = productClassId;
    blockMultiCut.worker_id = workerId;
    blockMultiCut.created_at = created_at;
    
    const blockMultiCutId = blockMultiCut.block_multi_cut_id;
    await this.blocksService.createBlockMultiCut(blockMultiCut);

    for (let indexBlock = 0; indexBlock < blocks.length; indexBlock++) {
      const selectedBlock = blocks[indexBlock];
      selectedBlock.block_multi_cut_id = blockMultiCutId;
      selectedBlock.status = "done";
      await this.blocksService.updateBlock(selectedBlock);
    }

    for (let indexCutRow = 0; indexCutRow < cuts.length; indexCutRow++) {
      const blueprintId = cuts[indexCutRow].blueprint_id;
      const partsCount = cuts[indexCutRow].quantity;
      
      if (!blueprintId || !partsCount) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      
      const warehouseItem = new WarehouseItem();
      warehouseItem.blueprint_id = blueprintId;
      warehouseItem.block_multi_cut_id = blockMultiCutId;
      warehouseItem.count = partsCount;
      warehouseItem.created_at = new Date();
      warehouseItem.worker_id = workerId;
      
      const blockCut = new BlockCut();
      blockCut.block_multi_cut_id = blockMultiCutId;
      blockCut.blueprint_id = warehouseItem.blueprint_id;
      blockCut.count = warehouseItem.count;
      blockCut.created_at = warehouseItem.created_at;
      blockCut.worker_id = warehouseItem.worker_id

      const blockCutResult = await this.blocksService.createBlockCut(blockCut);
      warehouseItem.block_cut_id = blockCutResult.block_cut_id;

      await this.warehouseItemsService.create(warehouseItem);
    }
    
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/process')
  async processForm(@Body() cuts: any, @Param('id') id: number): Promise<object> {
    if ((await this.blocksService.findOne(id)).status == "done") return;
    for (let selectInput = 0; selectInput < cuts.length; selectInput++) {
      const blueprintId = cuts[selectInput].blueprint_id;
      const partsCount = cuts[selectInput].quantity;
      
      if (!blueprintId || !partsCount) continue;
      if (blueprintId == 0 || partsCount == 0) continue;
      
      const warehouseItem = new WarehouseItem();
      warehouseItem.block_id = id;
      warehouseItem.blueprint_id = blueprintId;
      warehouseItem.count = partsCount;
      warehouseItem.created_at = new Date();
      warehouseItem.worker_id = (await this.blocksService.findOne(id)).worker_id;
      
      const blockCut = new BlockCut();
      blockCut.block_id = warehouseItem.block_id;
      blockCut.blueprint_id = warehouseItem.blueprint_id;
      blockCut.count = warehouseItem.count;
      blockCut.created_at = warehouseItem.created_at;
      blockCut.worker_id = warehouseItem.worker_id

      const blockCutResult = await this.blocksService.createBlockCut(blockCut);
      warehouseItem.block_cut_id = blockCutResult.block_cut_id;

      await this.warehouseItemsService.create(warehouseItem);
    }
    const block = await this.blocksService.findOne(id);
    block.status = "done";
    await this.blocksService.updateBlock(block);
    const content = {
      block: null,
      errors: []
    };
    content.block = await this.blocksService.findOne(id);
    return content;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.blocksService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class/:id')
  async findAllByClass(
    @Param('id') id: number,
  ): Promise<Block[]> {
    const blocks = await this.blocksService.findAllByClass(id);
    return blocks;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class-drying/:id')
  async findAllByClassDrying(
    @Param('id') id: number,
  ): Promise<Block[]> {
    const blocks = await this.blocksService.findAllByClassDrying(id);
    return blocks;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-class-queue/:id')
  async findAllByClassQueue(
    @Param('id') id: number,
  ): Promise<Block[]> {
    const blocks = await this.blocksService.findAllByClassQueue(id);
    return blocks;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-worker/:id')
  async findAllByWorker(
    @Param('id') id: number,
  ): Promise<Block[]> {
    const blocks = await this.blocksService.findAllByWorker(id);
    return blocks;
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-status/:status')
  async findAllByStatus(
    @Param('status') status: string,
  ): Promise<Block[]> {
    const blocks = await this.blocksService.findAllByStatus(status);
    return blocks;
  }

  @UseGuards(JwtAuthGuard)
  @Get('cuts-by-block/:id')
  async getCutsByBlock(
    @Param('id') id: number,
  ): Promise<BlockCut[]> {
    const blockCuts = await this.blocksService.getCutsByBlock(id);
    return blockCuts;
  }

  @UseGuards(JwtAuthGuard)
  @Get('cuts-by-worker/:id')
  async getCutsByWorker(
    @Param('id') id: number,
  ): Promise<BlockCut[]> {
    const blockCuts = await this.blocksService.getCutsByWorker(id);
    return blockCuts;
  }

  @UseGuards(JwtAuthGuard)
  @Get('multi-cut-by-block/:id')
  async getMultiCutByBlock(
    @Param('id') id: number,
  ): Promise<BlockMultiCut[]> {
    const blockMultiCut = await this.blocksService.getMultiCutByBlock(id);
    return blockMultiCut;
  }

  @UseGuards(JwtAuthGuard)
  @Get('multi-cuts-by-worker/:id')
  async getMultiCutsByWorker(
    @Param('id') id: number,
  ): Promise<BlockMultiCut[]> {
    const blockMultiCuts = await this.blocksService.getMultiCutsByWorker(id);
    return blockMultiCuts;
  }
}
