class RenameRecipeColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :recipes, :efficiency, :IBU
  end
end
