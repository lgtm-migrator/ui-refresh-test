import { FC } from 'react';
import { DataProduct } from '../../../common/api/collectionsApi';
import { Select } from '../../../common/components/Select';

interface TaxaHistogramData extends DataProduct {
  product: 'TaxaHistogram';
}

export const TaxaHistogram: FC<{ data: TaxaHistogramData }> = ({ data }) => {
  const fakeData = Array(10)
    .fill(0)
    .map(() => Math.floor(Math.random() * 100));
  const max = fakeData.reduce((p, c) => (p > c ? p : c));
  return (
    <>
      <Select
        value={{ value: 'Kingdom', label: 'Kingdom' }}
        options={[
          { value: 'Kingdom', label: 'Kingdom' },
          { value: 'Genus', label: 'Genus' },
          { value: 'vanillaSpecies', label: 'Species' },
        ]}
        // onChange={handleChange}
      />
      <br></br>
      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          gap: '5px',
        }}
      >
        {fakeData.map((val) => {
          const widthPercent = Math.round((val / max) * 10000) / 100;
          return (
            <div
              style={{
                display: 'flex',
                flexFlow: 'row nowrap',
                gap: '5px',
                fontSize: '12px',
                lineHeight: '25px',
              }}
            >
              <div>FooNameOfTaxaGroup</div>
              <div
                style={{
                  height: '25px',
                  width: `${widthPercent}%`,
                  background: 'steelblue',
                  textAlign: 'right',
                }}
              >
                {widthPercent > 25 ? (
                  <div
                    style={{
                      height: '25px',
                      color: 'white',
                      paddingRight: '5px',
                    }}
                  >
                    {val}
                  </div>
                ) : null}
              </div>
              {widthPercent < 25 ? (
                <div
                  style={{
                    height: '25px',
                    color: 'black',
                  }}
                >
                  {val}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
};
