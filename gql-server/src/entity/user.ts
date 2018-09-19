import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm'
import { League } from './league';
import { Team } from './team';

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  avatar: string

  @Column()
  time_zone: string

  // has many teams
  @OneToMany(_type => League, league => league.commissioner)
  leagues: League[]

  // has many leagues
  @OneToMany(_type => Team, team => team.user)
  teams: Team[]

  @CreateDateColumn()
  date_created: Date
}
