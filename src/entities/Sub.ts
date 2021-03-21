import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Entity from './Entity';
import User from './User';
import Post from './Post';
import { Expose } from 'class-transformer';

@TOEntity('subs')
export default class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  // @ManyToOne(() => Sub, (sub) => sub.posts)
  // @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
  // sub: Sub;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar/26a07923480af382c6af1addeed04c0a?d=mm&r=g&s=192';
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined;
  }
}
