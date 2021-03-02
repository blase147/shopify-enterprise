module CollectionHelper
  def retries_collection
    [["Dont retries", nil]] | (1..5).map {|i| ["#{i} #{"time".pluralize(i)}", i] }
  end

  def retries_day_collection
    [
      ['1 day', 1],
      ['2 days', 2],
      ['3 days', 3],
      ['5 days', 5],
      ['7 days', 7],
      ['14 days', 14],
      ['30 days', 30]
    ]
  end
end