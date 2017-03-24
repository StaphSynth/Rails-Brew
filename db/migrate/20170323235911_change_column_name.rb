class ChangeColumnName < ActiveRecord::Migration[5.0]
  def change
    rename_column :yeasts, :type, :fermentation_type
  end
end
