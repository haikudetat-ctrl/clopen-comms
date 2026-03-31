import type { RecipeListItem } from "@/src/features/communication-training/types";

export function RecipeLibraryList({ recipes }: { recipes: RecipeListItem[] }) {
  if (recipes.length === 0) {
    return (
      <section className="ops-card">
        <h2 className="ops-section-title">Recipe Library</h2>
        <p className="ops-muted">No recipes matched your search.</p>
      </section>
    );
  }

  return (
    <section className="ops-card">
      <h2 className="ops-section-title">Recipe Library</h2>
      <div className="ops-stack">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="ops-feed-item">
            <div className="ops-header-row">
              <h3 className="ops-item-title">{recipe.name}</h3>
              <div className="ops-tag-row">
                {recipe.station ? <span className="ops-badge">{recipe.station}</span> : null}
                {recipe.prepTimeMinutes ? (
                  <span className="ops-badge">{recipe.prepTimeMinutes} min</span>
                ) : null}
              </div>
            </div>

            {recipe.menuItemName ? <p className="ops-muted">Linked item: {recipe.menuItemName}</p> : null}

            <p className="ops-subheading">Ingredients</p>
            <p className="ops-body-copy">{recipe.ingredients}</p>

            <p className="ops-subheading">Method</p>
            <p className="ops-body-copy">{recipe.method}</p>

            {recipe.notes ? (
              <>
                <p className="ops-subheading">Notes</p>
                <p className="ops-body-copy">{recipe.notes}</p>
              </>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
