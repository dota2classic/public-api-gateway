import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";

@Entity("rule_entity")
export class RuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "index",
    type: "smallint",
  })
  index: number;

  @Column()
  description: string;

  @ManyToOne((type) => RuleEntity, (category) => category.children, {
    eager: false,
  })
  @JoinColumn({
    referencedColumnName: "id",
    name: "parent_id",
  })
  parent: Relation<RuleEntity>;

  @Column({
    name: "parent_id",
  })
  parentId: number;

  @OneToMany((type) => RuleEntity, (category) => category.parent, {
    eager: false,
  })
  children: Relation<RuleEntity>[];
}
