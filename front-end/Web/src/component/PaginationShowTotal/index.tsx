

interface PaginationShowTotalProps {
  all: number;
  range: any;
}

const PaginationShowTotal = ({ all, range }: PaginationShowTotalProps) => {

  return (
    <>
      {''
        .concat("Tổng", ' ')
        .concat(range[0], '-')
        .concat(range[1], ' ')
        .concat("trong", ' ')
        .concat(all.toString(), ' ')
        .concat("bản ghi")}
    </>
  );
};

export default PaginationShowTotal;