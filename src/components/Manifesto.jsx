import React, { useState } from 'react';
import { THEMES, LEVELS, PHASES } from '../data/index.js';
import MacroSpiral from './MacroSpiral.jsx';
import MicroArc from './MicroArc.jsx';

// The framework's philosophy, folded in from the old free-scroll overview. States
// what the tool is for (well-structured lessons from accurate, well-sourced
// research), shows the two-layer macro/micro structure with the same spiral/arc
// diagrams, and restates the three commitments. Presentational only — the
// diagrams keep local selection state and never touch the global composer.
function Manifesto() {
  const [theme, setTheme] = useState('identity');
  const [phase, setPhase] = useState(1);

  return (
    <div className="lf-manifesto">
      <div className="lf-manifesto-kicker">The manifesto</div>
      <h2 className="lf-manifesto-title">
        Well-structured lessons, <em>built from accurate, well-sourced research.</em>
      </h2>
      <p className="lf-manifesto-lead">
        The EFL Lesson Framework is a planning tool for Brazilian EFL teachers. Every move it
        recommends — every level, theme, phase, and activity — is tied to a citation you can read
        and trace. Nothing here is decoration: the goal is lessons that hold together because the
        research underneath them does.
      </p>

      <div className="lf-manifesto-layers">
        <div className="lf-manifesto-layer">
          <div className="lf-manifesto-layer-tag">Macro · curricular scale</div>
          <h3>Six themes, six levels. <em>Spiralling, not stacking.</em></h3>
          <p>
            The macro layer is a CEFR-anchored grid: six durable themes that deepen through every
            level (A1 inner ring, C2 outer). A theme is never &ldquo;finished&rdquo; — it returns,
            harder and richer, as proficiency grows.
          </p>
          <MacroSpiral
            themes={THEMES}
            levels={LEVELS}
            selectedId={theme}
            onSelect={setTheme}
            onUse={() => {}}
            hideUseCta
          />
        </div>

        <div className="lf-manifesto-layer">
          <div className="lf-manifesto-layer-tag">Micro · lesson scale</div>
          <h3>Seven phases, sixty minutes. <em>One full hour.</em></h3>
          <p>
            The micro layer is a seven-phase, 60-minute lesson template grounded in second language
            acquisition research — from lowering the affective filter, through input, noticing,
            output and feedback, to an informal-input bridge that follows learners back to the screen.
          </p>
          <MicroArc
            phases={PHASES}
            selectedId={phase}
            onSelect={setPhase}
            onUse={() => {}}
            hideUseCta
          />
        </div>
      </div>

      <div className="lf-manifesto-commitments">
        <div className="lf-manifesto-commitments-tag">Three commitments</div>
        <ul>
          <li>
            <strong>Informal input is curricular, not residual.</strong> A lesson that ends without
            an informal-input bridge hasn&rsquo;t closed the loop. Phase 7 is non-optional.
          </li>
          <li>
            <strong>L1 is a resource, not a contaminant.</strong> Strategic Portuguese supports
            rather than undermines acquisition. Translanguaging is permission, not problem.
          </li>
          <li>
            <strong>Variability is the norm.</strong> Learners don&rsquo;t progress linearly through
            the grid. The framework is a spiral, not a staircase.
          </li>
        </ul>
      </div>

      <p className="lf-manifesto-ethos">
        Where each move comes from is never hidden. Open the <em>Research</em> step to read the full
        bibliography and see exactly where every claim shows up in the framework.
      </p>
    </div>
  );
}

export default React.memo(Manifesto);
