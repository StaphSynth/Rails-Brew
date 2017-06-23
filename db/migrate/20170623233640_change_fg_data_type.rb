class ChangeFgDataType < ActiveRecord::Migration[5.0]
  def change
    change_column :recipes, :FG, :string
  end
end
