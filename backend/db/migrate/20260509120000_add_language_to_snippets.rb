class AddLanguageToSnippets < ActiveRecord::Migration[8.0]
  def change
    add_column :snippets, :language, :string, null: false, default: "javascript"
  end
end
