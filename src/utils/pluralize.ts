const rules = new Intl.PluralRules("ru-RU");

export const pluralize = (
  count: number,
  one: string,
  few: string,
  many: string,
) => {
  switch (rules.select(count)) {
    case "one":
      return one;
    case "two":
      return few;
    case "few":
      return few;
    case "many":
      return many;
    case "other":
      return many;
    case "zero":
      return many;
  }
};
