class AddJtiToUsers < ActiveRecord::Migration[8.0]
  def change
    # add_column :users, :jti, :string, null: false
    # add_index :users, :jti, unique: true
    add_column :users, :jti, :string
    User.all.each { |user| user.update_column(:jti, SecureRandom.uuid) }
    change_column_null :users, :jti, false
    add_index :users, :jti, unique: true
  end
end
