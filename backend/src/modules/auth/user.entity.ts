import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from "@mikro-orm/postgresql";

@Entity()
export class UserEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;
}
