export const helpTexts = {
  met: {
    header: "Metabolic Rate",
    body: (
      <>
        <strong>Definition:</strong> The rate at which your body produces energy (W) per unit surface area(m2).{" "}
        <br />
        <strong>Typical Values:</strong> 1.0 met represents a person sitting quietly (58.2 W/m²). Higher values indicate more intense activities such as walking or exercising.{" "}
        <br />
        <strong>Reference:</strong>{" "}
        Data in the list are based on {" "}
        <a
          href="https://www.ashrae.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          ASHRAE (American Society of Heating, Refrigerating and Air-Conditioning Engineers) standards
        </a>
        .
      </>
    ),
  },
  clo: {
    header: "Clothing Level",
    body: (
      <>
        <strong>Definition:</strong> Thermal insulation by clothing.{" "}
        <br />
        <strong>Typical Values:</strong> 1.0 clo corresponds to typical indoor business attire (business suits). Higher values represent warmer clothing such as winter wear.{" "}
        <br />
        <strong>Reference:</strong>{" "}
        Data in the list are based on {" "}
        <a
          href="http://escholarship.org/uc/item/18f0r375"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          a paper by Lee et al. (2013)
        </a>
        .
      </>
    ),
  },
  pcs: {
    header: "Personal Comfort System (PCS)",
    body: (
      <>
        <strong>Definition:</strong> Localized thermal devices that provide individual users with control over their immediate thermal environment.{" "}
        <br />
        <strong>Examples:</strong> Desk fans, heated chairs, foot warmers, and other body-targeted systems.{" "}
        <br />
        {/* <strong>Reference:</strong>{" "}
        Data in the list are based on some papers. */}
      </>
    ),
  },
};
