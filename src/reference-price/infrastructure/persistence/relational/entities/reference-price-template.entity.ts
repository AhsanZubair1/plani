import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'reference_price_template' })
export class ReferencePriceTemplateEntity {
  @PrimaryGeneratedColumn('increment')
  ref_price_template_id: number;

  @Column({ type: 'text', nullable: true })
  vdo_statement: string | null;

  @Column({ type: 'text', nullable: true })
  dmo_statement: string | null;

  @Column({ type: 'boolean', default: true, nullable: false })
  active: boolean;
}
