import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'planos'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tipo_plano_id').references('tipo_planos.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
