import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RefreshToken } from "./refreshToken";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
