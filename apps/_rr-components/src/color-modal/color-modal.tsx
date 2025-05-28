import {
  Dialog,
  Heading,
  Paragraph,
  Select,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

import type { Color } from '@digdir/designsystemet/color';
import {
  convertColor,
  getLuminanceFromColor,
} from '@digdir/designsystemet/color';
import { getCssVariable } from '@digdir/designsystemet/color';
import type { ChangeEvent } from 'react';
import { ClipboardButton } from '../clipboard-button/clipboard-button';
import classes from './color-modal.module.css';
import { capitalizeFirstLetter, getColorCombinations } from './util';

type ColorModalProps = {
  colorModalRef: React.Ref<HTMLDialogElement> | null;
  namespace: string;
  color: Color;
};

export const ColorModal = ({
  colorModalRef,
  namespace,
  color,
}: ColorModalProps) => {
  const { displayName, description, number, hex } = color;
  const [convertedColor, setConvertedColor] = useState<string>(
    convertColor(hex, 'oklch'),
  );

  const handleColorFormat = (event: ChangeEvent<HTMLSelectElement>) => {
    setConvertedColor(convertColor(hex, event.target.value));
  };

  return (
    <Dialog
      ref={colorModalRef}
      closedby='any'
      style={{
        maxWidth: '650px',
      }}
    >
      <Dialog.Block>
        <Heading data-size='xs'>
          {`${capitalizeFirstLetter(namespace)} ${displayName}`}
        </Heading>
      </Dialog.Block>
      <div
        className={classes.colorPreview}
        style={{ backgroundColor: hex }}
      ></div>
      <Dialog.Block className={classes.modalContent}>
        <Paragraph data-size='sm' className={classes.description}>
          {description.long}
        </Paragraph>
        <div data-size='sm' className={classes.grid}>
          <Paragraph className={classes.key}>Hexkode</Paragraph>
          <Paragraph asChild className={classes.value}>
            <div>
              {hex} <ClipboardButton value={hex} />
            </div>
          </Paragraph>
          <Select defaultValue='oklch' onChange={handleColorFormat}>
            <Select.Option value='hct'>HCT</Select.Option>
            <Select.Option value='hsluv'>HSLUV</Select.Option>
            <hr />
            <Select.Option value='hsl'>HSL</Select.Option>
            <Select.Option value='hwb'>HWB</Select.Option>
            <Select.Option value='oklch'>OKLCH</Select.Option>
            <Select.Option value='p3'>P3</Select.Option>
            <Select.Option value='rgb'>RGB</Select.Option>
            <Select.Option value='xyz-d65'>XYZ-D65</Select.Option>
          </Select>
          <Paragraph className={classes.value}>
            {convertedColor}
            <ClipboardButton value={convertedColor} />
          </Paragraph>
          <Paragraph className={classes.key}>CSS variabel</Paragraph>
          <Paragraph className={classes.value}>
            {getCssVariable(namespace, number)}
            <ClipboardButton value={getCssVariable(namespace, number)} />
          </Paragraph>
          <Paragraph className={classes.key}>Relativ luminans</Paragraph>
          <Paragraph className={classes.value}>
            {getLuminanceFromColor(hex).toFixed(3)}
          </Paragraph>
          {number !== 9 && number !== 10 && number !== 11 && (
            <>
              <Paragraph className={classes.key}>Kan brukes mot</Paragraph>
              <Paragraph className={classes.value}>
                {getColorCombinations(number)}
              </Paragraph>
            </>
          )}
        </div>
      </Dialog.Block>
    </Dialog>
  );
};
