import styled from 'styled-components'

export const SelectionList = styled.div``

export const SelectionListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  background: ${(p) => p.theme.bg};
  border-radius: ${(p) => p.theme.borderRadius};
  border: 2px solid transparent;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: 0.25s all;

  &.selected {
    cursor: default;
    color: ${(p) => p.theme.primary};
    border-color: ${(p) => p.theme.primary};
    background: ${(p) => p.theme.bgAlt};
  }

  &:hover {
    background: ${(p) => p.theme.bgAlt2};
  }
`

export const BlockchainLogo = styled.img`
  width: 1.5rem;
  height: auto;
  margin-right: 0.75rem;
`
