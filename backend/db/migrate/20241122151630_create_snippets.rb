class CreateSnippets < ActiveRecord::Migration[8.0]
  def change
    create_table :snippets do |t|
      t.string :title
      t.text :content
      t.references :board, null: false, foreign_key: true
      t.boolean :is_public

      t.timestamps
    end
  end
end
