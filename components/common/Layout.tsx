import styled from '@emotion/styled';
import { Property } from 'csstype';

interface FlexProps {
  justifyContent?: Property.JustifyContent;
  alignItems?: Property.AlignItems;
}

export const FlexRow = styled('div')<FlexProps>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: props.justifyContent ?? 'center',
  alignItems: props.alignItems ?? 'center',
}));

export const FlexCol = styled('div')<FlexProps>((props) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: props.justifyContent ?? 'center',
  alignItems: props.alignItems ?? 'center',
}));
