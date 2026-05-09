class CreateSnippetComments < ActiveRecord::Migration[8.0]
  def change
    create_table :snippet_comments do |t|
      t.references :snippet, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :body, null: false

      t.timestamps
    end
  end
end
