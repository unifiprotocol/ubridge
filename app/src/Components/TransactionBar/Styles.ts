import styled from 'styled-components'

export const TransactionBarWapper = styled.div<{ active: boolean }>`
  position: absolute;
  left: 0;
  top: -1rem;
  height: ${(props) => (props.active ? '1.5rem' : '0rem')};
  background: #00e676;
  width: 100%;
  color: #000;
  transition: height 0.3s;
  overflow: auto;
  background: ${(props) => props.theme.primary};
`

export const TransactionBarContent = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`
