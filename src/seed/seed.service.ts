import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PokeResponse } from './interfaces/poke-response.interface.js';
import { Pokemon } from '../pokemon/entities/pokemon.entity.js';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter.js';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly PokemonModel: Model<Pokemon>, //inject model to handle DB
    private readonly http: AxiosAdapter, // inject adapter for http rquest with axios
  ) {}

  async executedSeed() {
    await this.PokemonModel.deleteMany({}); //clean the DB
    const data = await this.http.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const pokemonsToInserts: { name: string; no: number }[] = [];

    data.results.forEach(
      async ({ name, url }: { name: string; url: string }) => {
        const segments = url.split('/');
        const no: number = +segments[segments.length - 2];
        pokemonsToInserts.push({ name, no });
      },
    );

    await this.PokemonModel.insertMany(pokemonsToInserts);
    return 'Seed executed';
  }
}
