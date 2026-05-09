class CreateSnippetLikes < ActiveRecord::Migration[8.0]
  def change
    create_table :snippet_likes do |t|
      t.references :snippet, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :snippet_likes, [:snippet_id, :user_id], unique: true
  end
end
