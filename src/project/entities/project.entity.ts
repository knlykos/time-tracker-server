import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  name?: string;
  @Column()
  description?: string;
  @Column()
  @OneToMany(() => ProjectsStatusRel, (status) => status.project_status_id)
  status?: number;
  @Column()
  user_id?: number;
  @Column()
  created_at?: Date;
}

export class ProjectsStatusRel {
  @PrimaryGeneratedColumn()
  project_status_id?: number;
  @Column()
  project_status_name?: string;
  @ManyToMany(() => Project, (project) => project.status)
  project?: Project;
}
