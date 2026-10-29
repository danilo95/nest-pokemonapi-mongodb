import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity.js';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name) private readonly PokemonModel: Model<Pokemon>, //inject model to handle DB
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit', 5);
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase(); //To standarize name and make easy seach just a example
    try {
      const pokemon = await this.PokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error: unknown) {
      this.handleExeptions(error);

      throw new InternalServerErrorException("Can't create Pokemon");
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.PokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon | null = null;

    if (!isNaN(+id)) {
      // Search by Pokemon number
      pokemon = await this.PokemonModel.findOne({ no: +id });
    } else if (isValidObjectId(id)) {
      // Search by MongoDB ObjectId
      pokemon = await this.PokemonModel.findById(id);
    } else {
      // Search by Pokemon name
      pokemon = await this.PokemonModel.findOne({
        name: id.toLowerCase(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no "${id}" not found`,
      );
    }

    return pokemon;
  }
  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
    } catch (error: unknown) {
      this.handleExeptions(error);
    }

    return { ...pokemon.toJSON(), ...UpdatePokemonDto };
  }

  async remove(id: string) {
    // const result = await this.PokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.PokemonModel.deleteOne({
      _id: id,
    });

    if (deletedCount === 0) {
      throw new BadRequestException(`pokemon with ${id} not found `);
    }
    return;
  }

  private handleExeptions(error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      const [field, value] = Object.entries(error.keyValue ?? {})[0] ?? [];

      throw new BadRequestException(
        `Pokemon already exists with ${field}: ${value}`,
      );
    }
  }
}
