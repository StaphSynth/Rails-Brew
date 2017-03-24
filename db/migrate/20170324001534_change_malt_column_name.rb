class ChangeMaltColumnName < ActiveRecord::Migration[5.0]
  def change
    rename_column :malts, :type, :malt_type
  end
end
