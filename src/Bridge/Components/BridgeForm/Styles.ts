import styled from 'styled-components'

export const From = styled.div`
  padding: 1rem;
`

export const To = styled.div`
  padding: 1rem;
`

export const BridgeDirection = styled.div`
  cursor: pointer;
  padding: 0rem;
  line-height: 0;
  text-align: center;
  color: ${(p) => p.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    vertical-align: middle;
  }
  span {
    transition: 0.25s all;
    text-transform: uppercase;
    font-size: 80%;
    opacity: 0;
  }
  &:hover {
    color: ${(p) => p.theme.primaryLight};
    span {
      opacity: 1;
    }
  }
`
