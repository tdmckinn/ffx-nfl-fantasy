import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'

import { League } from './league'
import { User } from './user'
import { Player } from './player';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('simple-array')
  picks: number[]

  @Column()
  draft_date_time: Date

  @OneToOne(_type => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @ManyToOne(_type => User, user => user.teams)
  user: User

  @ManyToOne(_type => League, league => league.teams)
  league: League

  // has many players
  @OneToMany(_type => Player, player => player.team)
  players: Player[]

  @CreateDateColumn()
  date_created: string
}
