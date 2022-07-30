import { Injectable, ValidationError } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './block.entity';
import { validate } from 'class-validator';
import { BlockCut } from './block-cut.entity';

import { Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BlockMultiCut } from './block-multi-cut.entity';

@Injectable()
export class BlocksService {
  private readonly logger = new Logger(BlocksService.name);

  constructor(
    @InjectRepository(Block)
    private readonly blocksRepository: Repository<Block>,
    @InjectRepository(BlockCut)
    private readonly blockCutsRepository: Repository<BlockCut>,
    @InjectRepository(BlockMultiCut)
    private readonly blockMultiCutsRepository: Repository<BlockMultiCut>,
  ) {}

  async getLastBlockMultiCutId(): Promise<number> {
    await this.cronBlocksDryingTerm();
    const blockMultiCut = await this.blockMultiCutsRepository.findOne({
      order: { block_multi_cut_id: 'DESC' },
    });
    if (blockMultiCut) return blockMultiCut.block_multi_cut_id;
    return 0;
  }

  async validation(block: Block): Promise<ValidationError[]> {
    const validateBlock = new Block();
    validateBlock.block_id = parseInt(block.block_id.toString(10));
    validateBlock.worker_id = block.worker_id
      ? parseInt(block.block_id.toString(10))
      : null;
    validateBlock.product_class_id = block.product_class_id
      ? parseInt(block.product_class_id.toString(10))
      : null;
    validateBlock.drying_started_at = block.drying_started_at
      ? new Date(block.drying_started_at)
      : null;
    validateBlock.drying_ends_at = block.drying_ends_at
      ? new Date(block.drying_ends_at)
      : null;
    validateBlock.status = block.status ? block.status : null;
    const result = await validate(validateBlock);
    return result;
  }

  async create(block: Block): Promise<Block> {
    return await this.blocksRepository.save(block);
  }

  async createBlockMultiCut(
    blockMultiCut: BlockMultiCut,
  ): Promise<BlockMultiCut> {
    return await this.blockMultiCutsRepository.save(blockMultiCut);
  }

  async getMultiCutByBlock(id: number): Promise<BlockMultiCut[]> {
    return await this.blockMultiCutsRepository.find({
      relations: [
        'block_cuts',
        'block_cuts.warehouse_item',
        'blocks',
        'blocks.blueprint',
        'blocks.blueprint.product_class',
        'blocks.blueprint.product_size',
        'worker',
      ],
      where: { blocks: { block_id: id } },
    });
  }

  async getMultiCutsByWorker(id: number): Promise<BlockMultiCut[]> {
    return await this.blockMultiCutsRepository.find({
      relations: [
        'block_cuts',
        'block_cuts.warehouse_item',
        'blocks',
        'blocks.blueprint',
        'blocks.blueprint.product_class',
        'blocks.blueprint.product_size',
        'worker',
      ],
      where: { worker_id: id },
    });
  }

  async createBlockCut(blockCut: BlockCut): Promise<BlockCut> {
    return await this.blockCutsRepository.save(blockCut);
  }

  async getCutsByBlock(id: number): Promise<BlockCut[]> {
    return await this.blockCutsRepository.find({
      relations: [
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
        'worker',
        'block',
        'warehouse_item',
      ],
      where: { block_id: id },
    });
  }

  async getCutsByWorker(id: number): Promise<BlockCut[]> {
    return await this.blockCutsRepository.find({
      relations: [
        'blueprint',
        'blueprint.product_class',
        'blueprint.product_size',
        'worker',
        'block',
        'warehouse_item',
      ],
      where: { worker_id: id },
    });
  }

  async findAll(): Promise<Block[]> {
    await this.cronBlocksDryingTerm();
    return await this.blocksRepository.find({
      relations: ['product_class', 'worker'],
      order: { block_id: 'DESC' },
    });
  }

  async findAllByClass(id: number): Promise<Block[]> {
    return await this.blocksRepository.find({
      relations: ['product_class', 'worker'],
      where: { product_class_id: id },
      order: { block_id: 'DESC' },
    });
  }

  async findAllByClassDrying(id: number): Promise<Block[]> {
    await this.cronBlocksDryingTerm();
    return await this.blocksRepository.find({
      relations: ['product_class', 'worker'],
      where: { product_class_id: id, status: 'drying' },
      order: { block_id: 'DESC' },
    });
  }

  async findAllByClassQueue(id: number): Promise<Block[]> {
    await this.cronBlocksDryingTerm();
    return await this.blocksRepository.find({
      relations: ['product_class', 'worker'],
      where: { product_class_id: id, status: 'queue' },
      order: { block_id: 'DESC' },
    });
  }

  async findAllByWorker(id: number): Promise<Block[]> {
    return await this.blocksRepository.find({
      relations: ['product_class', 'worker'],
      where: { worker_id: id },
      order: { block_id: 'DESC' },
    });
  }

  async findAllByStatus(status: string): Promise<Block[]> {
    return await this.blocksRepository.find({
      relations: ['product_class', 'worker'],
      where: { status: status },
      order: { block_id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Block> {
    return await this.blocksRepository.findOne(id, {
      relations: ['product_class', 'worker'],
    });
  }

  async findAllDrying(): Promise<Block[]> {
    return await this.blocksRepository.find({
      relations: ['product_class', 'worker'],
      where: { status: 'drying' },
      order: { block_id: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    await this.blocksRepository.delete(id);
  }

  async removeBlocks(blocks: Block[]): Promise<void> {
    for (let length = 0; length < blocks.length; length++) {
      await this.blocksRepository.delete(blocks[length].block_id);
    }
    return;
  }

  async getLastBlockId(): Promise<number> {
    await this.cronBlocksDryingTerm();
    const block = await this.blocksRepository.findOne({
      order: { block_id: 'DESC' },
    });
    if (block) return block.block_id;
    return 0;
  }

  async constructEditFormBlock(block: Block): Promise<object> {
    const editableBlock = {
      block_id: block.block_id,
      worker_id: block.worker_id,
      product_class_id: block.product_class_id,
      status: block.status,
      drying_started_at: block.drying_started_at
        ? block.drying_started_at.toLocaleString('lt-LT').split(' ').join('T')
        : '',
      drying_ends_at: block.drying_ends_at
        ? block.drying_ends_at.toLocaleString('lt-LT').split(' ').join('T')
        : '',
    };
    return editableBlock;
  }

  async buildStatusSelectOptions(selectedStatus: string): Promise<string[]> {
    const statusOptions = ['drying', 'queue', 'wip', 'done', 'void'];
    const content = [];
    for (
      let statusOption = 0;
      statusOption < statusOptions.length;
      statusOption++
    ) {
      const status = statusOptions[statusOption];
      const htmlObj = { status: status, selected: null };
      if (status == selectedStatus) htmlObj.selected = `selected`;
      content.push(htmlObj);
    }
    return content;
  }

  async updateBlock(block: Block): Promise<object> {
    return await this.blocksRepository.update(block.block_id, block);
  }

  async updateBlockStateToDry(id: number): Promise<object> {
    const block = await this.findOne(id);
    block.status = 'queue';
    return this.updateBlock(block);
  }

  async forWorker(id: number): Promise<Block[]> {
    return await this.blocksRepository.find({
      relations: ['product_class', 'worker'],
      where: { worker_id: id },
      order: { block_id: 'DESC' },
    });
  }

  async cronBlocksDryingTerm(): Promise<boolean> {
    const blocks = await this.findAllDrying();

    for (let indexBlock = 0; indexBlock < blocks.length; indexBlock++) {
      const block = blocks[indexBlock];
      const dryTerm =
        block.drying_ends_at.getTime() <= new Date().getTime() ? true : false;
      if (!dryTerm) continue;

      await this.updateBlockStateToDry(block.block_id);
      this.logger.debug(
        `Block [${block.block_id}:${block.product_class.name}:${block.product_class.days_to_dry}D]: Blocks Drying Term Done!`,
      );
    }

    return true;
  }
}

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly blocksService: BlocksService) {}

  @Cron('0 0 * * * *')
  async handleCron() {
    this.logger.debug('Cron Job 1 Hour: Blocks Drying Term Check Begin');
    await this.blocksService.cronBlocksDryingTerm();
    this.logger.debug('Cron Job 1 Hour: Blocks Drying Term Check Done');
  }
}
