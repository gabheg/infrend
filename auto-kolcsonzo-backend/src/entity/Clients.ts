import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  address!: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  @Length(5, 20) // adjust length according to ID format
  idCardNumber!: string;

  @Column()
  @IsNotEmpty()
  @Matches(/^\+?[0-9\s\-]{7,15}$/) // basic phone regex
  phone!: string;

  @Column()
  @IsEmail()
  email!: string;
}
