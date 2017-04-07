class RenameMaltColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :malts, :GPK, :ppg
  end
end
