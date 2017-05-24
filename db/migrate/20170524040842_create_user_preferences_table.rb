class CreateUserPreferencesTable < ActiveRecord::Migration[5.0]
  def change
    create_table :user_preferences do |t|
      t.integer :user_id
      t.string :volume, :limit => 1, :null => false
      t.string :temp, :limit => 1, :null => false
      t.string :weight, :limit => 1, :null => false
    end
  end
end
