import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Client } from "./Clients";
import { Vehicle } from "./Vehicles";
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export enum RentalStatus {
  ONGOING = "ongoing",
  CLOSED = "closed",
}

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Client, { eager: true })
  @JoinColumn({ name: "clientId" })
  client!: Client;

  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: "vehicleId" })
  vehicle!: Vehicle;

  @Column({ type: "date" })
  @IsDate()
  startDate!: Date;

  @Column({ type: "date", nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Column({ type: "decimal", nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;

  @Column({ type: "decimal", nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  kilometersDriven?: number;

  @Column({ default: false })
  damaged!: boolean;

  @Column({ type: "decimal", nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  damageFee?: number;

  @Column({
    type: "enum",
    enum: RentalStatus,
    default: RentalStatus.ONGOING,
  })
  @IsEnum(RentalStatus)
  status!: RentalStatus;
}
