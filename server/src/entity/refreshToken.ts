import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";


@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ unique: true })
    token!: string
    
    @ManyToOne(() => User, (user) => user.refreshTokens)
    @JoinColumn({name: 'userId'})
    user!: User

    @Column()
    userId!: string;
}