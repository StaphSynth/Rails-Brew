class RenameStock < ActiveRecord::Migration[5.0]
  def change
    rename_table :stocks, :stock_items
  end
end
