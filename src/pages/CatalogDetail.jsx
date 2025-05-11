import React from 'react';
import { useParams } from 'react-router-dom';

const CatalogDetail = () => {
  const { category } = useParams();

  return <h1>Catalog Category: {category}</h1>;
};

export default CatalogDetail;
 