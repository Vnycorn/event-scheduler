export function compareData<T>(data1: T, data2: T): boolean {
  let compare_result = true;
  if (
    typeof data1 === "string" ||
    typeof data1 === "number" ||
    typeof data1 === "boolean"
  ) {
    if (data1 !== data2) compare_result = false;
  }

  if (Array.isArray(data1) && Array.isArray(data2)) {
    compare_result = data1.length === data2.length;
    const sortedData1 = data1.sort();
    const sortedData2 = data2.sort();
    sortedData1.forEach((value, index) => {
      if (value !== sortedData2[index]) compare_result = false;
    });
  }
  return compare_result;
}

export function groupArray<T>(arr: T[], groupSize: number): T[][] {
  return arr.reduce((acc: T[][], item, index) => {
    if (index % groupSize === 0) acc.push([]);
    acc[acc.length - 1].push(item);
    return acc;
  }, []);
}
