import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePokemonDto {
  @ApiProperty({ example: 25, description: 'Número de la Pokédex' })
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;

  @ApiProperty({ example: 'Pikachu', description: 'Nombre del Pokémon' })
  @IsString()
  @MinLength(1)
  name: string;
}
