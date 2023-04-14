import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ type: "integer", default: null })
  parentId: number;

  @Column({ type: "datetime" })
  createdAt: string;

  @ManyToOne(() => MenuItem, (menuItem: MenuItem) => menuItem.children)
  parent: MenuItem;

  @OneToMany(() => MenuItem, (menuItem: MenuItem) => menuItem.parent)
  children: MenuItem[];
}
