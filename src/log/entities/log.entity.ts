import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column()
  user_id: number;

  @Column()
  group_id: number;

  @Column({ nullable: true })
  org_id: number;

  @Column()
  date: Date;

  @Column()
  start_time: Date;

  @Column({ nullable: true })
  end_time: Date;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  client_id: number;

  @Column()
  project_id: number;

  @Column()
  task_id: number;

  @Column({ nullable: true })
  timesheet_id: number;

  @Column({ nullable: true })
  invoice_id: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: false })
  billable: boolean;

  @Column({ default: 'running' })
  status: string;
}
