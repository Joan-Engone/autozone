export interface Vehicle {
  id: string;
  name: string;
  year: number;
  engine: string;
  transmission: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageAlt: string;
}

export const INVENTORY_DATA: Vehicle[] = [
  {
    id: "mercedes-g63-amg",
    name: "Mercedes-Benz G63 AMG",
    year: 2023,
    engine: "4.0L V8",
    transmission: "Automatique",
    price: 185000,
    currency: "€",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDicRTyjCsZMJ2mpobp-SpZ63cxDYAPvnyBnU0GagFl9y0myICAm4WnvdEZ-aBObm-TISwWFhCAsHcDjjvNr8zXUsvlcmtRNxeZLeC8TSh-hgv7BI0Pi2Ge3oAsDIwsFcE7iTT0l-L5RzbJv5VmwGdhW6y8tAw1uLDBUK9pc1FMKPx0bn9pyNyFcOHCgp_-QqGwWIC3q_Qb3YW_6fswujxDr9Keem-DYXflDRzfjYdAjEHJeU9W3TYLjfswF35QTQvB1Ja9et73ORT4",
    imageAlt: "Mercedes-Benz G63 AMG 2023",
  },
  {
    id: "audi-r8-v10",
    name: "Audi R8 V10",
    year: 2022,
    engine: "5.2L V10",
    transmission: "Automatique",
    price: 172000,
    currency: "€",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBi76N1LHexM0-QB_MMo6ME5mUPuPnC0sZLX1m-HSNgh8F_n9wu33mr2HxeuSHRxKcHOV3EniHd0UA2QoFjeaYa8RRJUHOhpj8wp3GAkL_ybTY498hYkJTFZNJgRZMe5j4OGS0Vu0tbgCnL18wV3yis1-j1GFaR3uJ8EtAGI-sMRInPlDBNqRnXkh4-A37rVc6pNS2nvdRZuZ5NQx6btCbzZcluHNH-4wAitzbIsnmJGF9c1TTCh_wOU0XGUTdRSgaEZ7yyXm8IOV9w",
    imageAlt: "Audi R8 V10 2022",
  },
  {
    id: "porsche-911-turbo-s",
    name: "Porsche 911 Turbo S",
    year: 2023,
    engine: "3.8L",
    transmission: "Automatique",
    price: 210000,
    currency: "€",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCTsmL120RPpEXD2x4N1OBLGUIXjZu7krQ1lZBq2rThCPPhUo_HwWqj7BicLQeEus1BdR0wkYB17Hf6bSPOEoioGVevnZAYwAGbU42B5NAD-xFA6AAXnp_WTO0EZ8QU8vtXjdL0sxHrUK5y7JuwwGdNEE0nynDCWu3kIUoGYWUDdxLxBn4HJRswpUxguUuGtKazrmtZUCCeLrZczrKilLel-CEaMGf2Pq_5UMjVGWFAJxv6beBRVdZkhC3HPpnh6bwtuX9uzNLSwSHF",
    imageAlt: "Porsche 911 Turbo S 2023",
  },
  {
    id: "range-rover-autobiography",
    name: "Range Rover Autobiography",
    year: 2023,
    engine: "5.0L V8",
    transmission: "Automatique",
    price: 165000,
    currency: "€",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBuldtZIsg_fzUB1ZzPwmvk141NjbGRP2P6HAm2Mx7MWjuZP4WA44yTyfT8Yw91W4i5EoVLBqQxpiO_ng-QheuKCrGhcISV1rEc_cGmYmNjWP76A08VPXM8NKVhMpjCNhsNRBCD-0iUz-9QY-4HApe65aM2HeiXLJqpMMKv40EhQ7EPtTZyuWCxEtmokJrjX8AuZ3XWJ79f49y9fv_QHNfza_yL7hQpJH0b8xx-yISS9GSub3GKhS6pBLVA-LHhA675u2lJnU10LNK",
    imageAlt: "Range Rover Autobiography 2023",
  },
];