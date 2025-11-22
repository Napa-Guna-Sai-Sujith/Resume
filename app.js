document.addEventListener('DOMContentLoaded',function(){
  let expCount=0,projCount=0,eduCount=0
  let photoData=''
  const expContainer=document.getElementById('experiences')
  const projContainer=document.getElementById('projects')
  const eduContainer=document.getElementById('education')
  const photoInput=document.getElementById('photoInput')
  const photoThumb=document.getElementById('photoThumbnail')
  const removePhotoBtn=document.getElementById('removePhoto')
  function createNode(type,className,innerHTML){const n=document.createElement(type);if(className)n.className=className;if(innerHTML)n.innerHTML=innerHTML;return n}
  function makeExperienceNode(i){return createNode('div','card section-item',`<div><input placeholder="Job Title" class="expTitle" data-idx="${i}"><input placeholder="Company, Location" class="expCompany" data-idx="${i}"><input placeholder="Start – End" class="expDuration" data-idx="${i}"><textarea placeholder="Achievements — one per line" class="expBullets" data-idx="${i}" rows="3"></textarea></div><div><button type="button" class="btn remove">Remove</button></div>`)}
  function makeProjectNode(i){return createNode('div','card section-item',`<div><input placeholder="Project Title" class="projTitle" data-idx="${i}"><input placeholder="Tools / Technologies" class="projTools" data-idx="${i}"><textarea placeholder="Short description" class="projDesc" data-idx="${i}" rows="2"></textarea><input placeholder="Impact / Result" class="projImpact" data-idx="${i}"></div><div><button type="button" class="btn remove">Remove</button></div>`)}
  function makeEducationNode(i){return createNode('div','card section-item',`<div><input placeholder="Degree" class="eduDegree" data-idx="${i}"><input placeholder="Institution" class="eduInst" data-idx="${i}"><input placeholder="Start – End" class="eduDuration" data-idx="${i}"><input placeholder="Grade / CGPA" class="eduGrade" data-idx="${i}"></div><div><button type="button" class="btn remove">Remove</button></div>`)}
  function addNode(container,createFn,countFn){const node=createFn(countFn());container.appendChild(node);const btn=node.querySelector('.remove');if(btn)btn.addEventListener('click',()=>node.remove());return node}
  function addExperience(prefill){const node=addNode(expContainer,makeExperienceNode,()=>expCount++);if(prefill){node.querySelector('.expTitle').value=prefill.title||'';node.querySelector('.expCompany').value=prefill.company||'';node.querySelector('.expDuration').value=prefill.duration||'';node.querySelector('.expBullets').value=(prefill.bullets||[]).join('\n')}}
  function addProject(prefill){const node=addNode(projContainer,makeProjectNode,()=>projCount++);if(prefill){node.querySelector('.projTitle').value=prefill.title||'';node.querySelector('.projTools').value=prefill.tools||'';node.querySelector('.projDesc').value=prefill.desc||'';node.querySelector('.projImpact').value=prefill.impact||''}}
  function addEducation(prefill){const node=addNode(eduContainer,makeEducationNode,()=>eduCount++);if(prefill){node.querySelector('.eduDegree').value=prefill.degree||'';node.querySelector('.eduInst').value=prefill.inst||'';node.querySelector('.eduDuration').value=prefill.duration||'';node.querySelector('.eduGrade').value=prefill.grade||''}}
  document.getElementById('addExp').addEventListener('click',()=>addExperience())
  document.getElementById('addProj').addEventListener('click',()=>addProject())
  document.getElementById('addEdu').addEventListener('click',()=>addEducation())
  addExperience()
  addProject()
  addEducation()
  function getValue(id){return document.getElementById(id)?.value.trim()||''}
  function getFormData(){
    const data={
      name:getValue('name'),
      role:getValue('role'),
      email:getValue('email'),
      phone:getValue('phone'),
      location:getValue('location'),
      linkedin:getValue('linkedin'),
      portfolio:getValue('portfolio'),
      summary:getValue('summary'),
      skills:getValue('skills'),
      certs:getValue('certs').split('\n').map(s=>s.trim()).filter(Boolean),
      languages:getValue('languages').split(',').map(s=>s.trim()).filter(Boolean),
      awards:getValue('awards').split('\n').map(s=>s.trim()).filter(Boolean),
      layout:getValue('layoutStyle'),
      photo:photoData||'',
      experiences:[],
      projects:[],
      education:[]
    }
    Array.from(expContainer.children).forEach(e=>{
      const t=e.querySelector('.expTitle')
      if(!t) return
      const title=t.value.trim()
      const company=(e.querySelector('.expCompany')?.value||'').trim()
      const duration=(e.querySelector('.expDuration')?.value||'').trim()
      const bullets=(e.querySelector('.expBullets')?.value||'').split('\n').map(s=>s.trim()).filter(Boolean)
      if(title||company||duration||bullets.length) data.experiences.push({title,company,duration,bullets})
    })
    Array.from(projContainer.children).forEach(p=>{
      const t=p.querySelector('.projTitle')
      if(!t) return
      const title=t.value.trim()
      const tools=(p.querySelector('.projTools')?.value||'').trim()
      const desc=(p.querySelector('.projDesc')?.value||'').trim()
      const impact=(p.querySelector('.projImpact')?.value||'').trim()
      if(title||tools||desc||impact) data.projects.push({title,tools,desc,impact})
    })
    Array.from(eduContainer.children).forEach(ed=>{
      const d=ed.querySelector('.eduDegree')
      if(!d) return
      const degree=d.value.trim()
      const inst=(ed.querySelector('.eduInst')?.value||'').trim()
      const dur=(ed.querySelector('.eduDuration')?.value||'').trim()
      const grade=(ed.querySelector('.eduGrade')?.value||'').trim()
      if(degree||inst||dur||grade) data.education.push({degree,inst,duration:dur,grade})
    })
    return data
  }
  function setFormData(data){
    if(!data||typeof data!=='object') return
    const ids=['name','role','email','phone','location','linkedin','portfolio','summary','skills','layout','languages']
    ids.forEach(id=>{if(document.getElementById(id) && data[id]!==undefined) document.getElementById(id).value=data[id]})
    if(Array.isArray(data.certs)) document.getElementById('certs').value=data.certs.join('\n')
    if(Array.isArray(data.awards)) document.getElementById('awards').value=data.awards.join('\n')
    photoData = data.photo||''
    updatePhotoThumb()
    expContainer.innerHTML=''
    projContainer.innerHTML=''
    eduContainer.innerHTML=''
    expCount=projCount=eduCount=0
    if(Array.isArray(data.experiences) && data.experiences.length) data.experiences.forEach(e=>addExperience(e))
    else addExperience()
    if(Array.isArray(data.projects) && data.projects.length) data.projects.forEach(p=>addProject(p))
    else addProject()
    if(Array.isArray(data.education) && data.education.length) data.education.forEach(ed=>addEducation(ed))
    else addEducation()
  }
  function updatePhotoThumb(){
    photoThumb.innerHTML=''
    if(!photoData){
      photoThumb.classList.add('empty')
      photoThumb.textContent='No photo'
      return
    }
    photoThumb.classList.remove('empty')
    const img=document.createElement('img')
    img.src=photoData
    photoThumb.appendChild(img)
  }
  photoInput.addEventListener('change',function(e){
    const f=e.target.files && e.target.files[0]
    if(!f) return
    const reader=new FileReader()
    reader.onload=function(ev){
      photoData = ev.target.result || ''
      updatePhotoThumb()
    }
    reader.readAsDataURL(f)
  })
  removePhotoBtn.addEventListener('click',function(){photoData='';photoInput.value='';updatePhotoThumb()})
  function escapeHtml(s){if(!s) return '';return s.replace(/[&<>"']/g,function(m){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]})}
  function escapeAttr(s){if(!s) return '';return s.replace(/"/g,'&quot;')}
  function generatePreview(){
    const d=getFormData()
    let summary=d.summary
    if(!summary){
      const first=(d.name||'').split(' ')[0]||''
      summary=`${first} is a ${d.role||'professional'} skilled in ${ (d.skills||'').split(',').slice(0,4).map(s=>s.trim()).filter(Boolean).join(', ')||'relevant areas' }.`
    }
    let html=`<div class="preview-header">`
    if(d.photo){
      html+=`<div class="preview-avatar"><img src="${escapeAttr(d.photo)}" alt="photo"></div>`
    }
    html+=`<div class="preview-name"><h1>${escapeHtml(d.name)}</h1><p class="role">${escapeHtml(d.role)}</p></div><div class="preview-contact">`
    if(d.email) html+=`<div class="item"><a href="mailto:${escapeAttr(d.email)}">${escapeHtml(d.email)}</a></div>`
    if(d.phone) html+=`<div class="item"><a href="tel:${escapeAttr(d.phone)}">${escapeHtml(d.phone)}</a></div>`
    if(d.location) html+=`<div class="item">${escapeHtml(d.location)}</div>`
    if(d.linkedin) html+=`<div class="item"><a href="${escapeAttr(d.linkedin)}">${escapeHtml(d.linkedin)}</a></div>`
    if(d.portfolio) html+=`<div class="item"><a href="${escapeAttr(d.portfolio)}">${escapeHtml(d.portfolio)}</a></div>`
    html+=`</div></div><div class="preview-grid"><div class="content"><div class="section"><div class="section-title">Professional Summary</div><p>${escapeHtml(summary)}</p></div>`
    if(d.skills) html+=`<div class="section"><div class="section-title">Skills</div><div class="pill-list">${d.skills.split(',').map(s=>s.trim()).filter(Boolean).map(s=>`<span class="pill">${escapeHtml(s)}</span>`).join('')}</div></div>`
    if(d.experiences && d.experiences.length){
      html+=`<div class="section"><div class="section-title">Experience</div>`
      d.experiences.forEach(e=>{
        html+=`<div class="exp-item"><div class="meta"><div class="title">${escapeHtml(e.title)}</div><div class="meta-right">${escapeHtml(e.duration)}</div></div><div class="company">${escapeHtml(e.company)}</div><ul>`
        ;(e.bullets||[]).forEach(b=>html+=`<li>${escapeHtml(b)}</li>`)
        html+=`</ul></div>`
      })
      html+=`</div>`
    }
    if(d.projects && d.projects.length){
      html+=`<div class="section"><div class="section-title">Projects</div>`
      d.projects.forEach(p=>{
        html+=`<div class="exp-item"><div class="meta"><div class="title">${escapeHtml(p.title)}</div><div class="meta-right">${escapeHtml(p.tools)}</div></div><p>${escapeHtml(p.desc)}</p>${p.impact?`<div><strong>Impact:</strong> ${escapeHtml(p.impact)}</div>`:''}</div>`
      })
      html+=`</div>`
    }
    if(d.education && d.education.length){
      html+=`<div class="section"><div class="section-title">Education</div>`
      d.education.forEach(ed=>{
        html+=`<div class="exp-item"><div class="meta"><div class="title">${escapeHtml(ed.degree)}</div><div class="meta-right">${escapeHtml(ed.duration||ed.dur||'')}</div></div><div class="company">${escapeHtml(ed.inst)}</div><div>${escapeHtml(ed.grade)}</div></div>`
      })
      html+=`</div>`
    }
    html+=`</div><aside class="sidebar">`
    if(d.certs && d.certs.length){
      html+=`<div class="sidebar-card"><div class="section-title">Certifications</div><ul>`
      d.certs.forEach(c=>html+=`<li>${escapeHtml(c)}</li>`)
      html+=`</ul></div>`
    }
    if(d.languages && d.languages.length){
      html+=`<div class="sidebar-card"><div class="section-title">Languages</div><p>${d.languages.map(escapeHtml).join(', ')}</p></div>`
    }
    if(d.awards && d.awards.length){
      html+=`<div class="sidebar-card"><div class="section-title">Achievements</div><ul>`
      d.awards.forEach(a=>html+=`<li>${escapeHtml(a)}</li>`)
      html+=`</ul></div>`
    }
    html+=`</aside></div>`
    window.currentPreviewHTML=html
    const preview=document.getElementById('resumePreview')
    preview.innerHTML=html
    preview.className=`resume-preview ${d.layout||'classic'}`
  }
  document.getElementById('generate').addEventListener('click',generatePreview)
  function downloadPDF(){
    if(!window.currentPreviewHTML) return alert("Please generate preview first.")
    const el=document.createElement('div')
    el.innerHTML=window.currentPreviewHTML
    el.style.background='#fff'
    el.style.padding='18px'
    el.style.boxSizing='border-box'
    el.style.maxWidth='800px'
    el.style.margin='0 auto'
    document.body.appendChild(el)
    const opt={margin:10,filename:'resume.pdf',image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:'pt',format:'a4',orientation:'portrait'}}
    html2pdf().from(el).set(opt).save().then(()=>el.remove()).catch(()=>el.remove())
  }
  function downloadMarkdown(){
    if(!window.currentPreviewHTML) return alert("Please generate preview first.")
    const d=getFormData()
    let md=`# ${d.name}\n\n**${d.role}**\n\n${d.email} | ${d.phone} | ${d.location}\n\n## Professional Summary\n\n${d.summary||''}\n\n`
    if(d.photo) md += `![photo](${d.photo})\n\n`
    if(d.skills) md+=`## Skills\n\n${d.skills}\n\n`
    if(d.experiences && d.experiences.length){
      md+=`## Experience\n\n`
      d.experiences.forEach(e=>{
        md+=`**${e.title}**, ${e.company} — ${e.duration}\n\n`
        ;(e.bullets||[]).forEach(b=>md+=`- ${b}\n`)
        md+='\n'
      })
    }
    if(d.projects && d.projects.length){
      md+=`## Projects\n\n`
      d.projects.forEach(p=>{
        md+=`**${p.title}** — ${p.tools}\n\n${p.desc}\n\n`
        if(p.impact) md+=`**Impact:** ${p.impact}\n\n`
      })
    }
    if(d.education && d.education.length){
      md+=`## Education\n\n`
      d.education.forEach(ed=>{
        md+=`**${ed.degree}**, ${ed.inst} — ${ed.duration||ed.dur||''} | ${ed.grade}\n\n`
      })
    }
    if(d.certs && d.certs.length){
      md+=`## Certifications\n\n`
      d.certs.forEach(c=>md+=`- ${c}\n`)
      md+='\n'
    }
    if(d.languages && d.languages.length) md+=`## Languages\n\n${d.languages.join(', ')}\n\n`
    if(d.awards && d.awards.length){
      md+=`## Achievements & Awards\n\n`
      d.awards.forEach(a=>md+=`- ${a}\n`)
      md+='\n'
    }
    const blob=new Blob([md],{type:'text/markdown'})
    const a=document.createElement('a')
    a.href=URL.createObjectURL(blob)
    a.download=(d.name?d.name.replace(/\s+/g,'_')+'_resume.md':'resume.md')
    a.click()
  }
  document.getElementById('downloadPdf').addEventListener('click',downloadPDF)
  document.getElementById('downloadMd').addEventListener('click',downloadMarkdown)
  function createShareableLink(){
    const data=getFormData()
    try{
      const json=JSON.stringify(data)
      const encoded=btoa(unescape(encodeURIComponent(json)))
      const url=`${location.origin}${location.pathname}?d=${encoded}`
      navigator.clipboard?.writeText(url).then(()=>alert('Shareable link copied to clipboard.')).catch(()=>prompt('Copy this shareable link:',url))
    }catch(err){
      alert('Failed to create share link: '+err.message)
    }
  }
  document.getElementById('shareLink').addEventListener('click',createShareableLink)
  function loadFromUrl(){
    const params=new URLSearchParams(location.search)
    const d=params.get('d')
    if(!d) return
    try{
      const json=decodeURIComponent(escape(atob(d)))
      const data=JSON.parse(json)
      setFormData(data)
      generatePreview()
    }catch(e){
      console.warn('Invalid data')
    }
  }
  const sampleData={
    name:'Asha Verma',
    role:'Software Engineer',
    email:'asha.verma@example.com',
    phone:'+91 9876543210',
    location:'Bengaluru, India',
    linkedin:'https://www.linkedin.com/in/ashaverma',
    portfolio:'https://asha.dev',
    summary:'Software engineer with 3+ years experience building scalable web applications.',
    skills:'JavaScript, React, Node.js, Express, MongoDB, AWS',
    certs:['AWS Certified Developer','Frontend Nanodegree'],
    languages:['English','Hindi'],
    awards:['University Gold Medal - 2019'],
    layout:'modern',
    photo:'data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect fill="#0b5ed7" width="100%" height="100%"/><text x="50%" y="50%" font-size="120" fill="#fff" text-anchor="middle" dominant-baseline="middle">AV</text></svg>'),
    experiences:[
      {title:'Frontend Developer',company:'Acme Corp',duration:'2022 – Present',bullets:['Built performance-critical dashboards','Reduced bundle size by 40%']},
      {title:'Software Engineer Intern',company:'TechLabs',duration:'2021 – 2022',bullets:['Implemented CI/CD pipeline','Improved test coverage to 85%']}
    ],
    projects:[
      {title:'Resume Builder',tools:'HTML, CSS, JS',desc:'An interactive resume builder with PDF export',impact:'Used by 500+ users'}
    ],
    education:[
      {degree:'B.Tech, Computer Science',inst:'NIT Example',duration:'2017 – 2021',grade:'8.7/10'}
    ]
  }
  document.getElementById('loadSample').addEventListener('click',function(){setFormData(sampleData);generatePreview()})
  loadFromUrl()
})