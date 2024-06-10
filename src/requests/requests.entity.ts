import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("requets")
export class RequestEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 32 })
    name: string

    @Column({ length: 144 })
    email: string

    @Column({ default: "active" })
    status: RequestEntityStatus

    @Column("longtext")
    message: string

    @Column("longtext", { default: null, nullable: true })
    comment: string

    @CreateDateColumn()
    createAt: Date

    @CreateDateColumn({ default: () => "NULL", nullable: true })
    updateAt: Date
}

export type RequestEntityStatus = "active" | "resolved" | "denied"