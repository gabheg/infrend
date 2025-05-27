import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from "class-validator";

export enum VehicleStatus {
  FREE = "free",
  RENTED = "rented",
  SCRAPPED = "scrapped",
}

export enum VehicleType {
  CAR = "car",
  BOAT = "boat",
}

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: VehicleType,
    default: VehicleType.CAR,
  })
  @IsNotEmpty()
  @IsEnum(VehicleType)
  type!: VehicleType;

  @Column()
  @IsNotEmpty()
  @IsString()
  manufacturer!: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  licensePlate!: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  chassisNumber!: string;

  @Column({ type: "date" })
  @IsDate()
  purchaseDate!: Date;

  @Column()
  @IsNotEmpty()
  @IsString()
  serialNumber!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  rentalPrice!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  @IsNumber()
  @Min(0)
  kmPrice!: number;

  @Column({
    type: "enum",
    enum: VehicleStatus,
    default: VehicleStatus.FREE, // <-- Default here
  })
  @IsNotEmpty()
  @IsEnum(VehicleStatus)
  status!: VehicleStatus;
}
