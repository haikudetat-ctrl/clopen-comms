import { RecipeLibraryList } from "@/src/features/communication-training/components";
import { getHubProfile, getRecipeLibrary } from "@/src/features/communication-training/queries";

export default async function RecipesPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const profile = await getHubProfile();

  if (!profile) {
    return null;
  }

  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? "";

  const recipes = await getRecipeLibrary(profile, query);

  return (
    <section className="ops-layout-grid">
      <section className="ops-card">
        <h2 className="ops-section-title">Recipe Search</h2>
        <p className="ops-muted">Search by dish name, ingredients, method, or notes.</p>

        <form className="ops-inline-form" role="search">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search recipes (e.g. duck, citrus, garnish)"
            aria-label="Search recipes"
          />
          <button type="submit" className="ops-button">
            Search
          </button>
        </form>
      </section>

      <RecipeLibraryList recipes={recipes} />
    </section>
  );
}
