class AddDescriptionToSnippets < ActiveRecord::Migration[8.0]
  def change
    add_column :snippets, :description, :text
  end
end
