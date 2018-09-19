import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  ManyToOne
} from 'typeorm'

import { Settings } from './settings'
import { Team } from './team'
import { User } from './user'

@Entity()
export class League {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  draft_id: string

  @Column()
  commissioner_name: string

  @Column()
  league_name: string

  @Column()
  draft_date_time: Date

  @OneToMany(_type => Team, team => team.id)
  teams: Team[]

  @ManyToOne(_type => User, user => user.leagues)
  @JoinColumn({ name: 'commissioner_id' })
  commissioner: User

  @OneToOne(_type => Settings)
  @JoinColumn({ name: 'league_settings_id' })
  league_settings: Settings

  @CreateDateColumn()
  date_created: Date
}
