import React from 'react';
import styled from 'styled-components';

const Date = styled.h3`
  margin: 0;
  text-transform: uppercase;
  font-size: 1.8rem;
  font-weight: 700;
`;

const PositionCompany = styled.h2`
  margin: 0;
  font-size: 4.5rem;
  font-weight: 700;

  @media (max-width: 1200px) {
    font-size: 3.2rem;
  }
`;

const Content = styled.div`
  font-size: 1.6rem;
  color: var(--text);
  line-height: 2;
  color: 200ms color ease;
  margin: 1.6rem 0;
`;

const Work: React.FC<{
  date: string;
  title: string;
  company: string;
}> = ({ date, title, company, children }) => (
  <div className="work">
    <Date>{date}</Date>
    <PositionCompany>
      {title} – {company}
    </PositionCompany>
    {children && <Content>{children}</Content>}
  </div>
);

export { Work };
