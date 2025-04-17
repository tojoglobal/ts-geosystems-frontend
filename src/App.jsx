import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MainNavbars from "./Navbars/MainNavbars";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HelmetProvider } from "react-helmet-async";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <>
      <HelmetProvider>
        <AppProvider>
          <BrowserRouter>
            <MainNavbars />
            <div className="h-[200rem] pl-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
              officiis sed necessitatibus dolore quisquam quas doloremque
              temporibus similique voluptas! Doloribus dolor exercitationem
              maiores iste maxime sequi aliquam voluptatibus quis, earum veniam
              nesciunt, velit saepe, molestiae esse laudantium vitae officiis
              aut similique inventore vel ullam impedit labore provident amet!
              Quisquam ab quibusdam eius autem eum animi voluptate, voluptatem
              sint tempora quis sunt repellat velit! Illum, tempore? Numquam
              inventore culpa odit officia aspernatur optio, et, fuga est
              dolorum rem quod nesciunt blanditiis dolorem nulla ipsa iure ad
              soluta veritatis praesentium, aut deleniti excepturi repudiandae
              quibusdam nihil? Id, ad? Laborum recusandae commodi iste atque,
              error, praesentium corporis ipsum quod reprehenderit totam tempora
              eligendi. Non tempora, laboriosam nam quae optio dolor excepturi
              sapiente beatae saepe error minus fugiat iste sed temporibus
              ducimus mollitia voluptatibus, voluptatum earum similique
              quibusdam quaerat et. Sed sequi vel, incidunt voluptate, minus ea
              sit dolore voluptates vero qui facere? Minima ut fugiat ea at
              cupiditate blanditiis rerum dolore, provident voluptate nostrum
              veniam qui quaerat possimus aut libero, a ipsam tempora sit?
              Corrupti nostrum possimus laborum in illo officiis? Dolorem ullam
              nulla labore at maxime exercitationem unde eligendi voluptas. Esse
              autem neque perferendis id cupiditate nisi, quo, tenetur fugiat
              porro debitis cumque quaerat est, ipsam omnis consectetur dolores
              accusantium ad. Dolore velit consequatur architecto et facilis
              dolorum veniam quo, provident nemo praesentium, reprehenderit
              magnam placeat consequuntur distinctio ratione molestiae, ex
              temporibus saepe. Fuga dicta omnis est illum error voluptates sint
              nam natus. Exercitationem sint sit amet possimus accusantium in
              dolores enim veniam, ullam repellendus minima doloremque, mollitia
              cum incidunt similique laborum laudantium soluta obcaecati id!
              Earum ex eos voluptatem itaque ipsa provident cum accusantium
              porro nesciunt molestiae iusto aut, eveniet totam quis officia
              dignissimos sunt, laborum omnis? Asperiores quidem at inventore
              autem tempora sint error harum nulla, explicabo voluptas dolores
              itaque magnam porro consequuntur? Illo totam facilis soluta vitae
              animi, incidunt placeat consectetur iusto architecto. Ea id
              ratione quas magni impedit, enim quasi consequatur totam quibusdam
              tempore quidem voluptas, nisi nostrum doloribus repudiandae
              distinctio! Mollitia amet, velit repudiandae corporis sapiente
              nobis ipsum ex officiis neque obcaecati quos maiores pariatur iure
              eius accusamus sed veniam. Blanditiis dolore atque deserunt itaque
              impedit nostrum aut eius quas. Provident optio nemo possimus saepe
              corrupti aut error quae perferendis natus atque, minus eligendi
              velit porro? Incidunt, quas ut omnis id similique perferendis
              sequi laudantium eius illum dolor, consectetur dolorum officia
              accusantium alias, tempora cumque quidem quam! Corrupti culpa
              incidunt voluptas explicabo, mollitia soluta ducimus. Asperiores
              quae cum et sequi quod nulla voluptas dolor accusantium pariatur
              cumque. Ab delectus sint nemo deserunt ad saepe qui totam corporis
              sed aliquid facilis repellat deleniti blanditiis ea exercitationem
              nihil quos amet reprehenderit voluptates, suscipit incidunt.
              Possimus ab nostrum necessitatibus. Expedita vero explicabo quis
              mollitia, ipsum eaque vel architecto adipisci tenetur pariatur
              modi possimus nihil voluptate id impedit eligendi! At temporibus
              ut eum non minus minima? Rerum, rem corrupti enim excepturi
              ducimus quae ea. Minima autem laboriosam corporis repellat quam,
              necessitatibus accusamus incidunt cupiditate veritatis ea. Autem
              cumque nostrum perspiciatis laboriosam voluptatibus est maxime
              magnam. Voluptates nulla repellendus accusamus.
            </div>
            {/* <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes> */}
          </BrowserRouter>
        </AppProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
